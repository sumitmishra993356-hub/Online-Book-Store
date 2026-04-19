// "use client"
// import React from 'react'
// import ViewBookDetails from '@/components/ViewBookDetails/ViewBookDetails'
// import { useParams } from 'next/navigation'

// const BookDecPage = () => {
//   return (
//     <div>
//       <ViewBookDetails/>
//     </div>
//   )
// }


// const BookDecPage = ({ params }: { params: { id: string } }) => {
//     console.log("ID:", params.id);
//   return (
//     <div>
//       <ViewBookDetails id={params.id} />
//     </div>
//   )
// }

// export default BookDecPage

// import ViewBookDetails from '@/components/ViewBookDetails/ViewBookDetails'

// const Page = async ({ params }: { params: Promise<{ id: string }> }) => {

//   const { id } = await params;

//   return <ViewBookDetails id={id} />
// }

// export default Page

// import ViewBookDetails from '@/components/ViewBookDetails/ViewBookDetails'

// const Page = ({ params }: { params: { id: string } }) => {
//   return <ViewBookDetails id={params.id} />
// }

// export default Page

import ViewBookDetails from '@/components/ViewBookDetails/ViewBookDetails'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {

  const { id } = await params; // ✅ VERY IMPORTANT

  return <ViewBookDetails params={{ id }} />
}

export default Page