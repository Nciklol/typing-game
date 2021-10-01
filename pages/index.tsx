import type { NextPage } from 'next'
import axios from "axios"
import { useEffect, useState } from 'react'
import Head from "next/head";

interface Props {
    _id: string
    // The quotation text
    content: string
    // The full name of the author
    author: string
    // The `slug` of the quote author
    authorSlug: string
    // The length of quote (number of characters)
    length: number
    // An array of tag names for this quote
    tags: string[]
}

let track: string;
let html = "";
let beforeRun: number;
let lock = false;

const Home: NextPage<Props> = (quote) => {
    const [content, setContent] = useState(quote.content);
    const [stats, setStats] = useState("");
    const [hint, setHint] = useState(false);

    useEffect(() => {
        const timer: NodeJS.Timeout = setTimeout(() => setHint(true), 3000);
        track = quote.content;

        document.addEventListener("keydown", e => {
            if (!lock && e.key === track[0]) {
                if (timer) {
                    clearTimeout(timer);
                    setHint(false);
                }
                if (!beforeRun) beforeRun = Date.now();

                html += `<mark class="completed"><u>${track[0]}</u></mark>`;

                track = track.slice(1);
                setContent(html + track);

                if (track.length == 0) {
                    lock = true;
                    const wpm = Math.round(quote.content.split(" ").length / ((Date.now() - beforeRun) / 1000 / 60));

                    setStats(`Well done! Completed in ${Math.round((Date.now() - beforeRun) / 10)/100}s with an average WPM of ${wpm}!`);
                }
            }
        })
    }, [])

    return (
        <>
            <Head>
                <title>Typing Game</title>
            </Head>
            <p className="quote" dangerouslySetInnerHTML={{__html: content}} />
            <p className="author">By: {quote.author}</p>
            <p className="stats">{stats}</p>
            {
                hint ? (<p className="hint">Hint: Type {quote.content[0]}</p>) : ""
            }
        </>
    )
}

Home.getInitialProps = async () => {
    const res = await axios.get("https://api.quotable.io/random");

    return res.data as Props;
}


export default Home