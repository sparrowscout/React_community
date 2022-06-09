// Post.js
import { db } from "../../shared/firebase";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";

// Actions (액션 타입을 정해주는 부분)
const LOAD = 'post/LOAD';
const CREATE = 'post/CREATE';
const UPDATE = 'post/UPDATE';
const REMOVE = 'post/REMOVE';

const initialState = {
    list : [{
        img_url:"https://mp-seoul-image-production-s3.mangoplate.com/added_restaurants/341739_1449941584642.jpg?fit=around|512:512&crop=512:512;*,*&output-format=jpg&output-quality=80",
        layout:"left",
        user:"민경" , 
        date:"22/06/07 14:22", 
        content:"테스트용 엽기떡볶이 사진과 내용",
        completed:false,
        user_email:"www.naver.com"
    },
]
}

// Action Creators

//로드(페이지에 뿌려주기)
export function loadPost(post_list) {
    return { type: LOAD, post_list }
}

//포스트 추가하기 
export function createPost(post) {
    console.log("게시글 추가할거야")
    return { type: CREATE, post };
}

//포스트 수정하기: 포스트 인덱스 가져와야함
export function updatePost(post_index) {
    return {type:UPDATE, post_index}
}

export function removePost(post_index) {
    console.log("게시글 삭제할거야")
    return { type: REMOVE, post_index }
}

// export function loadWidgets() {
//   return { type: LOAD };
// }

// export function createWidget(widget) {
//   return { type: CREATE, widget };
// }

// export function updateWidget(widget) {
//   return { type: UPDATE, widget };
// }
// // 자바스크립트에서는 딕셔너리의 키와 밸류가 똑같이 생겼으면 생략가능,
// //widget : widget ==> widget

// export function removeWidget(widget) {
//   return { type: REMOVE, widget };
// }


//middlewares
export const loadPostFB = () => {
    return async function (dispatch) {
        const post_data = await getDocs(collection(db, "post"));

        let post_list = [];

        post_data.forEach((doc) => {
            post_list.push({ id:doc.id , ...doc.data() });
        });

        dispatch(loadPost(post_list));

    }
}

export const addPostFB = (post) => {
return async function (dispatch) {
    console.log(post)
    const docRef = await addDoc(collection(db,"post"), post);
 
    // const _dictionary = await getDoc(docRef);
    const post_data = {id: docRef.id, ...post}
    // console.log((await getDoc(docRef)).data());
    console.log(post_data)

    dispatch(createPost(post_data));
}
}


//삭제:
export const removePostFB = (post_index) => {
    return async function (dispatch) {
        console.log(post_index)
        const docRef = await deleteDoc(doc(db, "post", post_index));
        console.log(docRef)
        dispatch(removePost(post_index));
    }
}

export const updatePostFB = (post, post_index) => {
    return async function (dispatch) {
        console.log(post_index)
        const decRef = await updateDoc(doc(db, "post", post_index), post)
    }
}
 

// Reducer
// 파라미터에 'state(어떤 값) = {} '들어가는 것 ==> 기본값을 준다
//만약에 리듀서라는 함수를 부를 때, 함수의 파라미터를 3개 받아야하는데
//인자값을 비워놓았을 때, 원래는 undefinde로 들어감.
// 오류를 방지하기 위해서 기본 값을 넣어주는 것.
// 파라미터에 값이 안들어오면 기본적으로 빈 딕셔너리일거야. 라는 뜻
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case "post/LOAD": {
            console.log("값을 가져올거야")
            return { list: action.post_list };
        }
        case "post/CREATE": {
            console.log("이제 값을 바꿀꺼야")
            const new_post_list = [...state.list, action.post];
            return { list: new_post_list };
        }

        case "post/UPDATE": {
            console.log("이제 수정할거야!")
            const new_post_list = state.list.map((l, idx)=>{
                if (parseInt(action.post_index) === idx){
                    console.log(action.post.user)
                } else { return l; }
            })
            return { list: new_post_list };
        }

        case "post/REMOVE": {
            console.log("이제 값을 삭제할거야")
            const new_post_list = [...state.list.filter(list => list !== action.post_index)];
            return { list: new_post_list };
        }

        default: return state;
    }
}


// side effects, only as applicable
// e.g. thunks, epics, etc

//미들웨어 : 데이터를 우리가 외부에서 가져와야하는 경우라던가, 
//서버에서 데이터 가지고 와야할 때는 보통 비동기 통신임. 데이터를 안가져왔기 때문에 바로 나 action creator 디스패치 했으니까 바꿔줘. 라고 할 수 없음
//그럴 때 미들웨어라고 불리는 중간다리를 놓음. 
// export function getWidget () {
//   return dispatch => get('/widget').then(widget => dispatch(updateWidget(widget)))
// }

