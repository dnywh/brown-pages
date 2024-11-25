# Brown Pages

Your local guide to composting, available at [www.brownpages.org](https://www.brownpages.org).

## Local set up

1. Clone the repository

```bash
git clone dnywh/brown-pages
cd brown-pages
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a .env file in the project root with the following values:

```bash
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

Fill in the values from Firebase.

4. Fetch runtime config and set MapTiler key dynamically:

Runtime environment variables (such as the MapTiler API key) are stored in Firebase's runtime config. First install the Firebase CLI following their isntructions. Then generate those environment variables locally:

```bash
firebase functions:config:get > .runtimeconfig.json
export VITE_MAPTILER_API_KEY=$(node -p "require('./.runtimeconfig.json').maptiler.key")
```

6. Run the development server:

```bash
npm run dev
```

## Deployment

To build and deploy the app to Firebase Hosting:

```bash
npm run build
firebase deploy
```

### Possible issues

#### MapTiler API key isn't being passed locally

Check that you've got this from Firebase:

```bash
firebase functions:config:get
```

#### MapTiler API key isn't being passed on GitHub merge or pull request actions

Make sure you've added the MapTiler API key to the GitHub repo's _Repository secrets_ section under MAPTILER_API_KEY.

## Contributing

Please open a new issue here on GitHub if you would like to suggest a change or addition to the site. You can also email me at submissions [at] website url.

Check out the [wiki](https://github.com/dnywh/brown-pages/wiki) if your suggestion is related to how the site is designed and/or built. It might give you some additional context or help you start contributing more quickly.
