'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const EditBook = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        author: '',
        price: '',
        url: '',
        desc: '',
        language: '',
    });

    // 🔥 fetch existing book
    useEffect(() => {
        if (!id) return;

        const fetchBook = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:1000/api/v1/get-book-by-id/${id}`
                );

                setForm(res.data.book);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBook();
    }, [id]);

    // 🔥 handle input
    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // 🔥 update book
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:1000/api/v1/update-book/${id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Book updated successfully ✅");

            router.push(`/book/${id}`);
        } catch (err) {
            console.error(err);
            alert("Update failed ❌");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-10">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-zinc-800 backdrop-blur-md border border-zinc-600 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-6"
            >

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400">
                    ✏️ Edit Book
                </h2>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">

                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Book Title"
                        className="w-full p-3 rounded-lg bg-zinc-700/60 border border-zinc-600 focus:border-yellow-400 outline-none transition"
                    />

                    <input
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        placeholder="Author Name"
                        className="w-full p-3 rounded-lg bg-zinc-700/60 border border-zinc-600 focus:border-yellow-400 outline-none transition"
                    />

                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price (₹)"
                        className="w-full p-3 rounded-lg bg-zinc-700/60 border border-zinc-600 focus:border-yellow-400 outline-none transition"
                    />

                    <input
                        name="language"
                        value={form.language}
                        onChange={handleChange}
                        placeholder="Language"
                        className="w-full p-3 rounded-lg bg-zinc-700/60 border border-zinc-600 focus:border-yellow-400 outline-none transition"
                    />
                </div>

                {/* Image URL */}
                <input
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="Image URL"
                    className="w-full p-3 rounded-lg bg-zinc-700/60 border border-zinc-600 focus:border-yellow-400 outline-none transition text-zinc-300"
                />

                {/* Description */}
                <textarea
                    name="desc"
                    value={form.desc}
                    onChange={handleChange}
                    placeholder="Book Description"
                    rows={5}
                    className="w-full p-3 rounded-lg bg-zinc-700/60 border border-zinc-600 focus:border-yellow-400 outline-none transition resize-none text-zinc-300"
                />

                {/* Button */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 font-semibold transition duration-200 active:scale-[0.98] text-zinc-900"
                >
                    Update Book
                </button>

            </form>
        </div>
    );

};

export default EditBook;



