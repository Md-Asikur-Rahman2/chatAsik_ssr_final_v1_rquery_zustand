import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryClientProvider } from "@/providers/QueryProvider";
import ChatContextProvider from "@/context/ChatContext/ChatContextProvider";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import NextThemeProvider from "@/providers/NextThemeProvider";
import ToastProvider from "@/providers/ToastProvider";
import { unstable_setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const ChatLoading = dynamic(() => import("./(chat)/conponents/ChatLoading"));
const Topbar = dynamic(() => import("./(chat)/conponents/Topbar"), {
  ssr: false,
  loading: () => <ChatLoading count={1} height={80} inline={false} radius={5} />,
});
import { fetchUser } from "@/functions/serverActions";
import Script from "next/script";
export const metadata: Metadata = {
  title: "Messengaria - Connect and Chat",
  creator: "Md Asikur Rahman",
  authors: [{ name: "Md Asikur Rahman", url: "https://asikur.vercel.app" }],
  description:
    "Welcome to Messengaria, the ultimate chat web app crafted by Asikur, a seasoned full-stack MERN/Next.js developer with over 5 years of expertise. Immerse yourself in a world of seamless communication with our cutting-edge chat application. Experience the power of real-time messaging, whether you're engaging in private conversations, joining lively group chats, or exploring innovative features like collaborative chat, secure messaging, and chat API integration. Our MERN stack and Next.js foundation ensure a robust and scalable chat solution that caters to modern communication needs.Discover the future of online communication with Messengaria's advanced features, including a responsive and intuitive chat UI, mobile chat app compatibility, and open-source flexibility. Unleash the potential of our chat widget, chat plugin, and chatroom software, making your website a hub for interactive and engaging conversations.Whether you're a developer seeking a chat API for integration or a user looking for a reliable and feature-rich messaging platform, Messengaria has you covered. Join our vibrant chat community and explore the endless possibilities of this dynamic chat application. Revolutionize your online interactions and elevate your communication experience with Messengaria - where innovation meets conversation.",
  icons: { icon: "/favicon.ico" },
  keywords:
    "chat application,asikur,md asikur,ashikur,asikur chat,asikur chat app,asikur rahman,mess messaging platform, online communication, real-time chat, web chat, instant messaging, chat room, group chat, MERN stack chat, Next.js chat, full-stack chat development, social messaging, conversational platform, interactive chat, web-based chat, communication tool, asynchronous messaging, chat service, chat software, text messaging app, communication app, chat solution, chat development, chat system, modern chat, chat technology, message platform, live chat, communication platform, node.js chat, react chat, JavaScript chat, chat API, secure messaging, private chat, public chat, chatroom application, chat app development, collaborative chat, chatbox, chat UI, mobile chat app, responsive chat, chat community, messaging solution, chat integration, scalable chat, chat widget, chat plugin, real-time messaging, chat API integration, scalable chat solution, chatroom software, chat server, chat-based application, chat feature, open-source chat, real-time chat app",
  openGraph: {
    images: [
      {
        url: "https://res.cloudinary.com/asikur/image/upload/v1709140648/iqppmsxc8bc3ldyqg879.png",
        width: 800,
        height: 600,
      },
    ],

    url: "https://messengaria.vercel.app/english",
    siteName: "Messengaria",

    type: "website",
    title: "Messengaria - Connect and Chat",
    description:
      "Welcome to Messengaria, the ultimate chat web app crafted by Asikur, a seasoned full-stack MERN/Next.js developer with over 5 years of expertise. Immerse yourself in a world of seamless communication with our cutting-edge chat application. Experience the power of real-time messaging, whether you're engaging in private conversations, joining lively group chats, or exploring innovative features like collaborative chat, secure messaging, and chat API integration. Our MERN stack and Next.js foundation ensure a robust and scalable chat solution that caters to modern communication needs.Discover the future of online communication with Messengaria's advanced features, including a responsive and intuitive chat UI, mobile chat app compatibility, and open-source flexibility. Unleash the potential of our chat widget, chat plugin, and chatroom software, making your website a hub for interactive and engaging conversations.Whether you're a developer seeking a chat API for integration or a user looking for a reliable and feature-rich messaging platform, Messengaria has you covered. Join our vibrant chat community and explore the endless possibilities of this dynamic chat application. Revolutionize your online interactions and elevate your communication experience with Messengaria - where innovation meets conversation.",
  },
};
const locales = [
  "english",
  "bangla",
  "canada",
  "china",
  "france",
  "germany",
  "india",
  "japan",
  "russia",
];
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  let languages;

  try {
    languages = (await import(`../../languages/${locale}.json` as string)).default;
  } catch (error) {
    notFound();
  }

  let user = await fetchUser();
  if (user.statusCode === 401) {
    user = {};
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      {/* {locale} */}
      <ReactQueryClientProvider>
        <ChatContextProvider>
          <body>
            {" "}
            <NextThemeProvider>
              <NextIntlClientProvider locale={locale} messages={languages}>
                <ToastProvider>
                  <Topbar user={user} />
                  {children}{" "}
                
                </ToastProvider>
                {/* <IntlPolyfills /> */}
              </NextIntlClientProvider>
            </NextThemeProvider>
          </body>
        </ChatContextProvider>
      </ReactQueryClientProvider>
    </html>
  );
}
