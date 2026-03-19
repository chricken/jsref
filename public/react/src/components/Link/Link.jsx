import './Link.css'
import {useStore} from "../../store/index.js";
import {useEffect, useState} from "react";

const Link = ({page, currentPage, handlerOpen, handlerPageChange}) => {

    const pages = useStore((state) => state.pages);
    const [children, setChildren] = useState([]);

    useEffect(() => {
        setChildren(pages.filter(p => p.parent === page?.id));
    }, []);

    // console.log(page);

    return (
        <>
            <div className={`Link ${(page.id === currentPage.id) ? 'currentPage' : ''}`}>
                <h4
                    onClick={() => {

                        handlerPageChange(page);
                        handlerOpen(true);
                        // console.log('Link clicked');
                    }}
                >
                    {page?.title}
                </h4>
                <div className="inner">
                    {children.length
                        ? <span
                            className={`opener ${page?.open ? 'open' : ''}`}
                            onClick={() => handlerOpen()}
                        >
                                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="2,2,15,8,2,14" fill="black"/>
                                </svg>
                            </span>
                        : ''
                    }
                    {
                        page?.open
                            ? children
                                .map(p => {
                                    // console.log(p);

                                    return <Link
                                        currentPage={currentPage}
                                        key={p.id}
                                        page={p}
                                        // handlerOpen={setChildren([...children])}
                                        handlerOpen={(openOnly) => {
                                            return setChildren(children.map(child => {
                                                if (openOnly) {
                                                    return (child.id === p.id) ? {...child, open: true} : child
                                                    // return (child.id === p.id) ? {...child, open: !child.open} : child
                                                } else {
                                                    return (child.id === p.id) ? {...child, open: !child.open} : child
                                                }
                                            }))
                                        }}
                                        handlerPageChange={handlerPageChange}
                                    />
                                })
                            : ''
                    }
                </div>
            </div>
        </>
    )
}

export default Link;