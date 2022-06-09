import React, { useState } from "react";
import styled from "styled-components";

import { loadPostFB, removePostFB } from "./redux/modules/Post";
import { useDispatch, useSelector } from "react-redux";
import { doc, DocumentReference } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import { list } from "firebase/storage";

const Main = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const my_post = useSelector((state) => state.post.list);

    React.useEffect(() => {
        dispatch(loadPostFB())
    }, []);

    console.log(my_post)

    const [layout, setLayout] = useState(true);


    const layoutCheck = () => {
        if (my_post.layout === "left") {
            return true;
        } else {
            return false;
        }
    }




    // 
    // result.push(<div><ImgPreview src={list.img_url} />{list.contet}</div>)

    return (
        <div>
            <h1>메인페이지 입니다.</h1>
            {my_post.map((list, index) => {

                const layoutCheck = () => {
                    if (list[index].layout === "center") {
                        return <div>
                            <ImgPreview src={list.img_url} /> {list.content}
                        </div>
                    } else {
                        return <div>
                            {list.content} <ImgPreview src={list.img_url} />
                        </div>

                    }
                }

                return <PostCard completed={list.completed} key={index} layout={list.layout}
                    onClick={() => { history.push("/detail/" + index) }}>

                    <div align="left">
                        {list.user}
                    </div>
                    <div align="right">
                        {list.date}
                    </div>


                    {/* {layoutCheck()} */}


                    <ImgPreview src={list.img_url} /> 
                    
                    <div align="left">
                      {list.content}
                    </div>
               

                </PostCard>

            })}
            <Fab color="secondary" aria-label="edit" sx={{ position: 'fixed', bottom: 20, right: 15 }}
                onClick={() => { history.push("/posting"); }}>
                <EditIcon />
            </Fab>
        </div>
    )
}





const PostCard = styled.div`
margin: auto;
border: 1px solid #9c27b0;
border-radius: 20px;
width: 90vw;
display: grid;
grid-template-columns: 1fr 1fr;
margin: 20px auto;

div {
    margin: 20px;
    text-align: ${(props) => props.align};
}
`;

const ImgPreview = styled.img`
background-color: #eee;
width: 300px;
margin: ${(props) => props.layout};
display: block;
border-radius: 0px 0px 0px 20px;
`;





export default Main;