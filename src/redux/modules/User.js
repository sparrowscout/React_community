// USer.js
import { auth, db } from "../../shared/firebase";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, getDoc, query, where } from "firebase/firestore";

// Actions (액션 타입을 정해주는 부분)
const LOAD = 'user/LOAD';
// const CREATE = 'user/CREATE';
// const UPDATE = 'user/UPDATE';
// const REMOVE = 'user/REMOVE';

const initialState = {
    list : [{
        img_url:"https://mp-seoul-image-production-s3.mangoplate.com/added_restaurants/341739_1449941584642.jpg?fit=around|512:512&crop=512:512;*,*&output-format=jpg&output-quality=80",
        nickname:"민경" , 
        user_email:"www.naver.com"
    },
]
}

// Action Creators

//로드(페이지에 뿌려주기)
export function loadUser(user_list) {
    return { type: LOAD, user_list }
}


//middlewares
export const loadUserFB = () => {
    return async function (dispatch) {
        const user_data = await getDocs(collection(db, "users"));

        let user_list = [];

        user_data.forEach((doc) => {
            user_list.push({ id:doc.id , ...doc.data() });
        });

        dispatch(loadUser(user_list));

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
        case "user/LOAD": {
            console.log("user 가져올거야")
            return { list: action.user_list };
        }
        case "user/CREATE": {
            console.log("이제 값을 바꿀꺼야")
            const new_user_list = [...state.list, action.user];
            return { list: new_user_list };
        }

        case "user/UPDATE": {
            console.log("이제 수정할거야!")
            const new_user_list = state.list.map((l, idx)=>{
                if (parseInt(action.user_index) === idx){
                    console.log(action.user.user)
                } else { return l; }
            })
            return { list: new_user_list };
        }

        case "user/REMOVE": {
            console.log("이제 값을 삭제할거야")
            const new_user_list = [...state.list.filter(list => list !== action.user_index)];
            return { list: new_user_list };
        }

        default: return state;
    }
}



