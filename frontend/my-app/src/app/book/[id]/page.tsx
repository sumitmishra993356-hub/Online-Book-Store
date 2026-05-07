// import ViewBookDetails from '@/components/ViewBookDetails/ViewBookDetails'

// const Page = async ({ params }: { params: Promise<{ id: string }> }) => {

//   const { id } = await params; // ✅ VERY IMPORTANT

//   return <ViewBookDetails params={{ id }} />
// }

// export default Page

import ViewBookDetails from '@/components/ViewBookDetails/ViewBookDetails'

const Page = () => {
  return <ViewBookDetails />
}

export default Page
