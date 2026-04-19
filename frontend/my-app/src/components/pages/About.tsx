'use client'

const About = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-10">

      {/* HERO */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          About <span className="text-yellow-400">Shopiko</span>
        </h1>
        <p className="text-zinc-400 text-lg">
          Your one-stop destination for discovering and buying amazing books 📚
        </p>
      </div>

      {/* ABOUT */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12">

        <div className="bg-zinc-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">
            📚 What We Do
          </h2>
          <p className="text-zinc-300">
            Shopiko is an online bookstore where users can browse books,
            add them to favourites, place orders, and track their purchases
            in a simple and modern interface.
          </p>
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3 text-yellow-400">
            🎯 Our Mission
          </h2>
          <p className="text-zinc-300">
            Our mission is to make reading more accessible and enjoyable by
            providing a smooth and user-friendly platform for book lovers.
          </p>
        </div>

      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          🚀 Features
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          {[
            "Browse Books",
            "Add to Favourites",
            "Order Books",
            "Order Tracking",
            "User Profile",
            "Responsive UI"
          ].map((feature) => (
            <div
              key={feature}
              className="bg-zinc-800 p-5 rounded-xl text-center hover:bg-zinc-700 transition"
            >
              {feature}
            </div>
          ))}

        </div>
      </div>

      {/* DEVELOPER */}
      <div className="max-w-3xl mx-auto text-center bg-zinc-800 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">
          👨‍💻 Developer
        </h2>

        <p className="text-zinc-300">
          This project is developed by <span className="text-yellow-400 font-semibold">Sumit Mishra</span>, 
          a passionate full-stack developer focused on building modern web applications.
        </p>
      </div>

    </div>
  )
}

export default About
