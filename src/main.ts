import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalDebugInterceptor } from './common/interceptors/global-debug.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global debug interceptor (only if DEBUG_REQUESTS is true)
  if (process.env.DEBUG_REQUESTS === 'true') {
    app.useGlobalInterceptors(new GlobalDebugInterceptor());
    console.log('🔍 Debug mode enabled - All requests/responses will be logged');
  }

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NutriWise API')
    .setDescription('The NutriWise API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management operations')
    .addTag('Profiles', 'User profile management')
    .addTag('Meals', 'Meal tracking and management')
    .addTag('Water', 'Water intake tracking')
    .addTag('Exercise', 'Exercise tracking and management')
    .addTag('Nutrition Goals', 'Nutrition goal setting and tracking')
    .addTag('Dashboard', 'Analytics and reporting')
    .addTag('OAuth', 'Social login with Google and Facebook')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Custom Swagger UI options to auto-load token from env or localStorage
  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      requestInterceptor: (req: any) => {
        // Auto-add Bearer prefix if not present
        if (req.headers.Authorization && !req.headers.Authorization.startsWith('Bearer ')) {
          req.headers.Authorization = `Bearer ${req.headers.Authorization}`;
        }
        return req;
      },
    },
    customJs: `
      // Auto-fill token from localStorage or env
      window.onload = function() {
        const token = localStorage.getItem('jwt_token') || '${process.env.SWAGGER_DEFAULT_TOKEN || ''}';
        if (token) {
          const authInput = document.querySelector('input[placeholder*="JWT"]');
          if (authInput) {
            authInput.value = token;
          }
        }
      };
    `,
  };

  SwaggerModule.setup('api', app, document, customOptions);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation is available at: http://localhost:${port}/api`);
  
  // Log environment info
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🐛 Debug Requests: ${process.env.DEBUG_REQUESTS || 'false'}`);
  console.log(`🗄️ Debug Database: ${process.env.DEBUG_DATABASE || 'false'}`);
  console.log(`🔐 Google OAuth: ${process.env.ENABLE_GOOGLE_OAUTH || 'false'}`);
  console.log(`📘 Facebook OAuth: ${process.env.ENABLE_FACEBOOK_OAUTH || 'false'}`);
}
bootstrap();