# Admin Panel Language Switching

The admin panel now supports multiple languages with a built-in language switcher.

## Supported Languages

- **English (en)** - Default language
- **Chinese (zh)** - 中文

## How to Use

1. **Language Switcher Location**: The language switcher is located in the top-right corner of the navbar, next to the profile image.

2. **Changing Languages**: 
   - Click on the current language display (shows "English" or "中文")
   - Select your preferred language from the dropdown
   - The page will automatically reload and display all text in the selected language

3. **Language Persistence**: Your language choice is automatically saved in localStorage and will be remembered when you return to the admin panel.

## Translated Content

The following areas are fully translated:

### Navigation
- Sidebar menu items (Add Items, List Items, Orders, Collection)
- Page titles and headers

### Add Items Page
- Form labels and placeholders
- Side dish management
- Submit buttons

### List Items Page
- Table headers
- Filter options
- Status indicators
- Action buttons

### Orders Page
- Order information labels
- Status options (Food Processing, Ready to Collect, Rejected)
- Filter options
- Action buttons

### Collection Page
- Collection information
- Order details

## Technical Details

- **Language Context**: Uses React Context API for global language state management
- **Translation System**: Centralized translations in `src/i18n.js`
- **Local Storage**: Language preference is stored in `admin_language` key
- **Auto-reload**: Language changes trigger a page reload to ensure all components update

## Adding New Languages

To add support for additional languages:

1. Add new language entries to the `translations` object in `src/i18n.js`
2. Add the language to the `LANGUAGES` array in `src/components/Navbar/Navbar.jsx`
3. Ensure all translation keys have values in the new language

## Adding New Translations

To translate new text:

1. Add the English text as a key in the `en` section of `src/i18n.js`
2. Add the corresponding translation in the `zh` section
3. Use `t('keyName')` in your components with the `useLanguage` hook

Example:
```jsx
import { useLanguage } from '../../LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return <h1>{t('pageTitle')}</h1>;
};
``` 