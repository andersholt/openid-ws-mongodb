import React, {useContext, useEffect, useState} from "react";
import {ProfileContext} from "../../hooks/loginProvider";
import {Navbar} from "../../components/navbar/navbar";
import "./frontpage.css"
import {fetchJSON, useLoader} from "../../hooks/global";


function ArticlesList({setSelectedArticle}) {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
        if (search === "") {
            fetchJSON("/api/articles/all").then((jsonData) => {
                setData(jsonData);
            });
        } else {
            fetchJSON(`/api/articles/search/?title=${search}`).then((jsonData) => {
                setData(jsonData.articles);
            });
        }
    }, [search]);

    const {error, loading} = useLoader(async () => {
        return await fetchJSON("/api/articles/all").then((jsonData) => {
            setData(jsonData);
        });
    });

    async function handleSearch(event) {
        setSearch(event);
    }

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error.toString()}</div>;
    }

    function selectArticle(title) {
        setSelectedArticle(title)
    }

    return (
        <div className="article-list">
            <label></label>
            <input value={search} onChange={(e) => handleSearch(e.target.value)}/>
            {search && <div>Results for {search}</div>}

            {data && (
                <>
                    {data.map((article, index) => (
                        <div key={index} id="article-card" onClick={() => selectArticle(article.title)}>
                            <h2>{article.title}</h2>
                            <p>Published on {getHumanDate(article.date)}</p>
                            <p>Written by {article.author}</p>
                            <p>Topics: {article.topic}</p>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

function getHumanDate(timestamp) {
    const humanDate = new Date(parseInt(timestamp)).toLocaleString()
    return humanDate
}

function ArticleRead({data}) {
    const article = data.article[0]
    return <main>
        <h1>{article.title}</h1>
        <p>Created: {getHumanDate(article.date)}</p>
        <p>Author: {article.author}</p>
        <p>Topics: {article.topic}</p>
        <article>{article.articleText}</article>
    </main>
}

function ArticleReadWrite({data}) {
    const article = data.article[0]
    const {userinfo} = useContext(ProfileContext);

    const [title, setTitle] = useState(article.title);
    const [topic, setTopic] = useState(article.topic);
    const [articleText, setArticleText] = useState(article.articleText);

    async function updateArticle(event) {
        event.preventDefault();
        await fetch("/api/articles/select/?originalTitle=" + article.title, {
            method: "put",
            body: new URLSearchParams({
                title,
                topic,
                articleText,
                author: userinfo.name,
                updated: Date.now()
            }),
        });
    }

    async function deleteArticle() {
        await fetch("/api/articles/select/?title=" + article.title, {
            method: "delete",
        });
    }

    return <>
        <form onSubmit={updateArticle}>
            <h2>Editmode</h2>
            <label>Title</label><br/>
            <input value={title} type={"text"} onChange={(e) => setTitle(e.target.value)}/>
            <p>Created at {getHumanDate(article.date)} and last edited at: {getHumanDate(article.updated)}</p>
            <p>Author: {article.author}</p>
            <label>Topic</label><br/>
            <input value={topic} onChange={(e) => setTopic(e.target.value)}/> <br/>
            <textarea value={articleText} onChange={(e) => setArticleText(e.target.value)}></textarea><br/>
            <button formAction={"submit"}>Publish article</button>
        </form>
        <button onClick={deleteArticle}>Delete this article</button>
    </>
}

export function ArticleWrite() {
    const {userinfo} = useContext(ProfileContext);

    const [title, setTitle] = useState("");
    const [topic, setTopic] = useState([]);
    const [articleText, setArticleText] = useState("");

    async function publishArticle(event) {
        event.preventDefault();
        await fetch("/api/articles/publish", {
            method: "post",
            body: new URLSearchParams({
                title,
                topic: topic,
                articleText,
                author: userinfo.name,
                date: Date.now()
            }),
        });
    }

    return <form onSubmit={publishArticle}>
        <h2>Write article</h2>
        <label>Title</label><br/>

        <input value={title} type={"text"} onChange={(e) => setTitle(e.target.value)}/>

        <p>Date</p>
        <p>author</p>

        <label>Type</label><br/>
        <input value={topic} onChange={(e) => setTopic(e.target.value)}/> <br/>

        <textarea value={articleText} onChange={(e) => setArticleText(e.target.value)}></textarea><br/>
        <button formAction={"submit"}>Publish article</button>
    </form>
}

function Article({mode, selectedArticle}) {
    const [data, setData] = useState()
    useEffect(() => {
        if (selectedArticle !== "") {
            fetchJSON("/api/articles/select/?title=" + selectedArticle).then((jsonData) => {
                if (jsonData) {
                    setData(jsonData);
                }
            });
        }
    }, [selectedArticle])


    return <main>
        {(mode === false && data !== undefined) && <>
            <ArticleRead data={data}/>
        </>}
        {(mode === true && data !== undefined) && <>
            <ArticleReadWrite data={data}/>
        </>}
    </main>
}

export function FrontPage() {
    const [editMode, setEditMode] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState("")
    const {userinfo} = useContext(ProfileContext);
    return (
        <div>
            {!userinfo && <>
                <Navbar/>
                <div className={"frontpage-container"}>
                    <ArticlesList/>
                </div>
            </>}
            {userinfo && <>
                <Navbar editMode={editMode} setEditMode={setEditMode}/>
                <div className={"frontpage-container"}>
                    <ArticlesList setSelectedArticle={setSelectedArticle}/>
                    <Article mode={editMode} selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle}/>
                </div>
            </>}
        </div>
    );
}
