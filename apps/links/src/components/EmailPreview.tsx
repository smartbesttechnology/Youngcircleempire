import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getEmailConfirmationTemplate, getWelcomeEmailTemplate } from '@/lib/emailTemplates';

export function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState<'confirmation' | 'welcome'>('welcome');
  const [previewData, setPreviewData] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    confirmationUrl: 'https://links.ycempire.studio/confirm?token=abc123'
  });

  const getTemplate = () => {
    if (selectedTemplate === 'confirmation') {
      return getEmailConfirmationTemplate(previewData.confirmationUrl);
    } else {
      const profileUrl = `https://links.ycempire.studio/${previewData.username}`;
      return getWelcomeEmailTemplate(previewData.username, profileUrl);
    }
  };

  const template = getTemplate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Template Preview</CardTitle>
          <CardDescription>
            Preview the email templates used in YC Empire Links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={selectedTemplate === 'welcome' ? 'default' : 'outline'}
              onClick={() => setSelectedTemplate('welcome')}
            >
              Welcome Email
            </Button>
            <Button
              variant={selectedTemplate === 'confirmation' ? 'default' : 'outline'}
              onClick={() => setSelectedTemplate('confirmation')}
            >
              Email Confirmation
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Template Data</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">Username:</label>
                  <input
                    type="text"
                    value={previewData.username}
                    onChange={(e) => setPreviewData({ ...previewData, username: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email:</label>
                  <input
                    type="email"
                    value={previewData.email}
                    onChange={(e) => setPreviewData({ ...previewData, email: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                {selectedTemplate === 'confirmation' && (
                  <div>
                    <label className="text-sm font-medium">Confirmation URL:</label>
                    <input
                      type="url"
                      value={previewData.confirmationUrl}
                      onChange={(e) => setPreviewData({ ...previewData, confirmationUrl: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Subject Line:</h4>
                <p className="text-sm bg-gray-100 p-2 rounded">{template.subject}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Email Preview</h3>
              <div 
                className="border rounded-lg overflow-hidden"
                style={{ height: '600px' }}
              >
                <iframe
                  srcDoc={template.html}
                  className="w-full h-full"
                  title="Email Preview"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Plain Text Version:</h4>
            <pre className="text-sm bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-auto max-h-40">
              {template.text}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
