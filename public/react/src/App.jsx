import './App.css';

import {useStore} from "./store/index.js";
import React, {useEffect, useState} from "react";
import Link from './components/Link/Link.jsx';
import Paragraph from './components/Paragraph/Paragraph.jsx';
import Subheader from './components/Subheader/Subheader.jsx';

import Subnav from './components/Subnav/Subnav.jsx';

const App = () => {

    const pages = useStore((state) => state.pages);
    const currentID = useStore((state) => state.startPageID);
    const [page1, setPage1] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);
    const replacePages = useStore((state) => state.replacePages);
    const [content, setContent] = useState(null)

    useEffect(() => {
        fetch('/data/pages.json').then(
            res => res.json()
        ).then(
            res => replacePages(res)
        ).catch(
            console.warn
        )
    }, []);

    useEffect(() => {
        setPage1(pages.find(p => p.id === currentID))
        setCurrentPage(pages.find(p => p.id === currentID))
    }, [pages]);

    useEffect(() => {
        // console.log('Current Page', currentPage);

        fetch(`/data/pages/${currentPage?.id}.json`).then(
            res => res.json()
        ).then(
            res => setContent(res)
        ).catch(
            console.warn
        )

    }, [currentPage])

    const createNav = () => {
        return <>
            <div>
                {
                    page1
                    && pages.length
                    && <Link
                        currentPage={currentPage}
                        page={page1}
                        handlerOpen={(openOnly = false) => {
                            console.log('openOnly', openOnly);

                            if (openOnly)
                                setPage1({...page1, open: true})
                            else
                                setPage1({...page1, open: !page1?.open})
                        }}
                        handlerPageChange={(page) => {
                            setCurrentPage(page)
                        }}
                    />
                }
            </div>
        </>
    }

    const createContent = () => {
        // console.log('Create Content', content);
        return content.content.map((item, index) => {

            if (item.type === 'paragraph') return <Paragraph item={item} key={index}/>
            else if (item.type === 'subheader') return <Subheader item={item} key={index}/>

        })
    }

    return (
        <div className={'all'}>
            <nav>
                {createNav()}
            </nav>
            <div className={'content'}>
                <div className={'subnav'}>
                    <Subnav items={content?.content}/>
                </div>
                <h1>{currentPage?.title}</h1>
                <main>
                    {content ? createContent() : ''}
                </main>
            </div>
            <footer></footer>
        </div>
    )
}

export default App;