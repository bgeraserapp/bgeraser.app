import { Code, CreditCard, Download, Shield, Upload, Zap } from 'lucide-react';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppConfig from '@/lib/app-config';

export const metadata = {
  title: 'API Documentation - BG Eraser',
  description: 'Complete API documentation for BG Eraser background removal service.',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              API Documentation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete guide to integrate BG Eraser&apos;s background removal API into your
              applications.
            </p>
          </div>

          {/* Quick Start */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">1. Get Your API Key</h3>
                  <p className="text-muted-foreground mb-4">
                    Sign up for an account and navigate to your dashboard to obtain your API key.
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    <code className="text-sm">X-API-Key: your_api_key_here</code>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">2. Make Your First Request</h3>
                  <p className="text-muted-foreground mb-4">
                    Send a POST request with your image to start removing backgrounds.
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    <code className="text-sm">POST /api/models/bg-remover</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Upload Endpoint */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Background Removal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    POST
                  </Badge>
                  <code className="block bg-muted p-2 rounded text-sm">/api/models/bg-remover</code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Request Headers</h4>
                  <div className="bg-muted rounded p-3 text-sm font-mono">
                    <div>Content-Type: multipart/form-data</div>
                    <div>X-API-Key: YOUR_API_KEY</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <div className="bg-muted rounded p-3 text-sm">
                    <div>
                      <strong>file</strong> (required): Image file (JPG, PNG, WebP)
                    </div>
                    <div>
                      <strong>format</strong> (optional): Output format (png, jpg)
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <div className="bg-muted rounded p-3 text-sm font-mono">
                    {`{
  "success": true,
  "original_url": "https://...",
  "processed_url": "https://...",
  "credits_used": 1,
  "processing_time": 2.3
}`}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Check Endpoint */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    GET
                  </Badge>
                  <code className="block bg-muted p-2 rounded text-sm">/api/credits/balance</code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Request Headers</h4>
                  <div className="bg-muted rounded p-3 text-sm font-mono">
                    <div>X-API-Key: YOUR_API_KEY</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <div className="bg-muted rounded p-3 text-sm font-mono">
                    {`{
  "success": true,
  "credits_remaining": 45,
  "total_credits": 50,
  "credits_used": 5
}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Examples */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Code Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* JavaScript Example */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">JavaScript/Node.js</h3>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      {`const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/models/bg-remover', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key'
  },
  body: formData
});

const result = await response.json();
console.log(result.processed_url);`}
                    </pre>
                  </div>
                </div>

                {/* Python Example */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Python</h3>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      {`import requests

files = {'file': open('image.jpg', 'rb')}
headers = {'X-API-Key': 'your_api_key'}

response = requests.post(
    '${AppConfig.api.baseUrl}/api/models/bg-remover',
    files=files,
    headers=headers
)

result = response.json()
print(result['processed_url'])`}
                    </pre>
                  </div>
                </div>

                {/* cURL Example */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">cURL</h3>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      {`curl -X POST \\
  -H "X-API-Key: your_api_key" \\
  -F "file=@image.jpg" \\
  ${AppConfig.api.baseUrl}/api/models/bg-remover`}
                    </pre>
                  </div>
                </div>

                {/* PHP Example */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">PHP</h3>
                  <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      {`$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => '${AppConfig.api.baseUrl}/api/models/bg-remover',
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => [
    'file' => new CURLFile('image.jpg')
  ],
  CURLOPT_HTTPHEADER => [
    'X-API-Key: your_api_key'
  ],
  CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($curl);
$result = json_decode($response, true);`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Codes */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Error Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <code className="font-semibold">400</code>
                    <span className="text-muted-foreground">Bad Request</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="font-semibold">401</code>
                    <span className="text-muted-foreground">Unauthorized</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="font-semibold">402</code>
                    <span className="text-muted-foreground">Insufficient Credits</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <code className="font-semibold">413</code>
                    <span className="text-muted-foreground">File Too Large</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="font-semibold">415</code>
                    <span className="text-muted-foreground">Unsupported Format</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="font-semibold">500</code>
                    <span className="text-muted-foreground">Server Error</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Limits & Best Practices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    • <strong>Free tier:</strong> 10 requests per minute
                  </li>
                  <li>
                    • <strong>Pro tier:</strong> 60 requests per minute
                  </li>
                  <li>
                    • <strong>Enterprise:</strong> Custom limits available
                  </li>
                  <li>• Rate limit headers included in responses</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Keep images under 10MB for best performance</li>
                  <li>• Use high-resolution images for better results</li>
                  <li>• Implement proper error handling</li>
                  <li>• Cache processed results when possible</li>
                  <li>• Monitor your credit usage</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
