import {Stack} from "expo-router";

export default function AuthLayout({children}) {
  return (
    <Stack screenOptions={{headerShown: false}}/>

  );
}
