import { defineMiddleware } from 'astro:middleware';
import { defaultLang, languages } from './i18n/ui';

export const onRequest = defineMiddleware(async (context, next) => {
  const [, lang] = context.url.pathname.split('/');

  // If no language is specified in the URL, redirect to the default language
  if (!lang) {
    return context.redirect(`/${defaultLang}${context.url.pathname}`);
  }

  // If the language is not supported, redirect to the default language
  if (lang && !languages[lang]) {
    const newPath = context.url.pathname.replace(`/${lang}`, `/${defaultLang}`);
    return context.redirect(newPath);
  }

  // Get the current route without the language prefix
  const route = context.url.pathname.substring(lang.length + 2) || '/';

  // Check if the page requires authentication
  if (isProtectedRoute(route)) {
    const isAuthenticated = context.cookies.get('auth')?.value === 'true';
    if (!isAuthenticated) {
      return context.redirect(`/${lang}/login?redirect=${encodeURIComponent(context.url.pathname)}`);
    }
  }

  const response = await next();
  return response;
});

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/admin',
    '/dashboard',
    // Add more protected routes here
  ];

  return protectedRoutes.some(route => pathname.startsWith(route));
}