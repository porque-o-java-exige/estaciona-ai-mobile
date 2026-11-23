export const env = {
  apiUrl:
    process.env.EXPO_PUBLIC_API_URL ||
    'https://estaciona-ai-app-dweefuc2eqckdwfn.brazilsouth-01.azurewebsites.net',
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
} as const;