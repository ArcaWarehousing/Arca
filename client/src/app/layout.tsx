'use client'
import './globals.css'

export default function RootLayout({children}: any) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* <AuthContextProvider> */}
          {children}
        {/* </AuthContextProvider> */}
      </body>
    </html>
  )
}