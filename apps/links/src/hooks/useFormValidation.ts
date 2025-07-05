import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  initialValues?: Partial<T>;
}

interface FormState<T> {
  values: Partial<T>;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  onSubmit,
  initialValues = {},
}: UseFormValidationOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
  });

  const validateField = useCallback(
    (name: keyof T, value: any): string | undefined => {
      try {
        // Create a partial schema for single field validation
        const fieldSchema = schema.pick({ [name]: true } as any);
        fieldSchema.parse({ [name]: value });
        return undefined;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message;
        }
        return 'Validation error';
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (values: Partial<T>): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
      try {
        schema.parse(values);
        return { isValid: true, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Partial<Record<keyof T, string>> = {};
          error.errors.forEach((err) => {
            if (err.path.length > 0) {
              const fieldName = err.path[0] as keyof T;
              errors[fieldName] = err.message;
            }
          });
          return { isValid: false, errors };
        }
        return { isValid: false, errors: {} };
      }
    },
    [schema]
  );

  const setValue = useCallback((name: keyof T, value: any) => {
    setState((prev) => {
      const newValues = { ...prev.values, [name]: value };
      const fieldError = validateField(name, value);
      const newErrors = { ...prev.errors };
      
      if (fieldError) {
        newErrors[name] = fieldError;
      } else {
        delete newErrors[name];
      }

      const { isValid } = validateForm(newValues);

      return {
        ...prev,
        values: newValues,
        errors: newErrors,
        isValid,
      };
    });
  }, [validateField, validateForm]);

  const setFieldTouched = useCallback((name: keyof T, touched: boolean = true) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name]: touched },
    }));
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
      isValid: false,
    }));
  }, []);

  const clearFieldError = useCallback((name: keyof T) => {
    setState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[name];
      
      const { isValid } = validateForm(prev.values);
      
      return {
        ...prev,
        errors: newErrors,
        isValid,
      };
    });
  }, [validateForm]);

  const setValues = useCallback((values: Partial<T>) => {
    setState((prev) => {
      const { isValid, errors } = validateForm(values);
      return {
        ...prev,
        values,
        errors,
        isValid,
      };
    });
  }, [validateForm]);

  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
    });
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        const { isValid, errors } = validateForm(state.values);
        
        if (!isValid) {
          setState((prev) => ({
            ...prev,
            errors,
            isSubmitting: false,
            // Mark all fields as touched to show errors
            touched: Object.keys(prev.values).reduce(
              (acc, key) => ({ ...acc, [key]: true }),
              {}
            ),
          }));
          return;
        }

        const validatedData = schema.parse(state.values);
        await onSubmit(validatedData);
        
        setState((prev) => ({ ...prev, isSubmitting: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, isSubmitting: false }));
        throw error;
      }
    },
    [schema, state.values, onSubmit, validateForm]
  );

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: state.values[name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(name, e.target.value);
      },
      onBlur: () => {
        setFieldTouched(name, true);
      },
      error: state.touched[name] ? state.errors[name] : undefined,
    }),
    [state.values, state.errors, state.touched, setValue, setFieldTouched]
  );

  const getCheckboxProps = useCallback(
    (name: keyof T) => ({
      checked: Boolean(state.values[name]),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(name, e.target.checked);
      },
      onBlur: () => {
        setFieldTouched(name, true);
      },
      error: state.touched[name] ? state.errors[name] : undefined,
    }),
    [state.values, state.errors, state.touched, setValue, setFieldTouched]
  );

  const getSelectProps = useCallback(
    (name: keyof T) => ({
      value: state.values[name] || '',
      onChange: (value: any) => {
        setValue(name, value);
      },
      onBlur: () => {
        setFieldTouched(name, true);
      },
      error: state.touched[name] ? state.errors[name] : undefined,
    }),
    [state.values, state.errors, state.touched, setValue, setFieldTouched]
  );

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    setValue,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    setValues,
    resetForm,
    handleSubmit,
    getFieldProps,
    getCheckboxProps,
    getSelectProps,
    validateField,
    validateForm,
  };
}
