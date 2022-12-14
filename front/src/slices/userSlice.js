import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginKakao, loginNaver, getUserInfo, signUp, putUserInfo, studyProgress, albumProgress, userDelete, logout, getRankingInfo } from "../common/user";
import { PURGE } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";

export const userLoginKakao = createAsyncThunk(
  "user/loginKakao",
  async (access_token, { rejectWithValue }) => {
    try {
      const response = await loginKakao({ access_token });
      sessionStorage.setItem("accessToken", response.data["accessToken"]);
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const userLoginNaver = createAsyncThunk(
  'user/loginNaver',
  async (access_token, {rejectWithValue}) => {
    try {
      const response = await loginNaver({access_token});
      sessionStorage.setItem("accessToken", response.data["accessToken"])
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)

export const getUser = createAsyncThunk(
  "user/userInfo",
  async (temp, { rejectWithValue }) => {
    try {
      const { data } = await getUserInfo();
      // C로 저장되어 있으면 C++로 변경
      if (data.data.language === "C") {
        data.data.language = "C++"
      }
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getProgress = createAsyncThunk(
  "user/studyProgress",
  async (temp, {rejectWithValue}) => {
    try {
      const {data} = await studyProgress()
      return data.data
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)

export const getAlbumProgress = createAsyncThunk(
  "user/albumProgress",
  async (temp, {rejectWithValue}) => {
    try {
      const {data} = await albumProgress()
      return data.data
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)

export const userLogout = createAsyncThunk(
  'user/logout',
  async (temp, {rejectWithValue}) => {
    try {
      logout()
    } catch(error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)

export const changUserInfo = createAsyncThunk(
  'user/put',
  async(data, {rejectWithValue}) => {
    try {
      // 전달할 인자
      const info = {nickname: data.nickname, language: data.language};
      // 파일
      const response = await putUserInfo(data.image, info)
      // console.log('회원정보 수정', response)
      return response.data.data
    } catch(error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)

export const DeleteUser = createAsyncThunk(
  'user/delete',
  async (temp, {rejectWithValue}) => {
    try {
      const {data} = await userDelete()
      return data.data
    } catch(error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)

export const rankingInfo = createAsyncThunk(
  'user/rank',
  async (temp, {rejectWithValue}) => {
    try {
      const {data} = await getRankingInfo()
      return data.data
    } catch(error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)


const initialState = () => {
  return ({
    userInfo: {email: null, language: null, loginType: null, nickname: null, socialId: null},
    isLogIn: false,
    error: null,
    progress: {study: {algorithm:0,backend:0,cs:0, frontend:0, language:0}, album: {} },
    rankInfo: {},
    isShowLogin: false,
  })

};

const userSlice = createSlice(
  {
  name: "user",
  initialState,
  reducers: {
    // 회원가입
    signUpUser: (state, action) => {
      signUp(action.payload);
      state.userInfo.language = action.payload.language;
      state.userInfo.nickname = action.payload.nickname;
      state.isLogIn = true;
    },
    showLoginBtn: (state, action) => {
      state.isShowLogin = true
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLoginKakao.pending, (state, action) => {
        state.isLoading = true; //로딩중
      })
      .addCase(userLoginKakao.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogIn = true
      })
      .addCase(userLoginKakao.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(userLoginNaver.fulfilled, (state, action) => {
        state.isLogIn = true
      })
      .addCase(getUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.userInfo = payload.data;
        state.isLogIn = true;
      })
      .addCase(getUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload.data;
        state.isLogIn = false;
      })
      .addCase(PURGE, () => initialState)
      .addCase(getProgress.fulfilled, (state, {payload})=>{
        state.progress.study = payload
        // console.log("페이로드", payload)
      })
      .addCase(getAlbumProgress.fulfilled, (state, {payload}) => {
        state.progress.album = payload
      })
      .addCase(userLogout.fulfilled, (state, {payload})=> {
        sessionStorage.removeItem('accessToken', '');
        // state 초기화
        state.userInfo = {email: null, language: null, loginType: null, nickname: null, socialId: null};
        state.isLogIn = false;
        state.error = null;
        state.progress = {study: {algorithm:0,backend:0,cs:0, frontend:0, language:0}, album: {} };
        state.rankInfo = {};
        state.isShowLogin = false;
        // 페이지 새로고침 필요x
        // window.location.reload()
      })
      .addCase(changUserInfo.fulfilled, (state, {payload}) => {
        if (payload.language === "C") {
          state.userInfo.language = "C++"
        } else { 
          state.userInfo.language = payload.language
        }
        state.userInfo.nickname = payload.nickname
        state.userInfo.profileImg = payload.profileImg
      })
      .addCase(DeleteUser.fulfilled, (state, {payload})=> {
        // 세션의 토큰 초기화
        sessionStorage.removeItem('accessToken', '');
        // state 초기화
        initialState()
        state.userInfo = {email: null, language: null, loginType: null, nickname: null, socialId: null};
        state.isLogIn = false;
        state.error = null;
        state.progress = {study: {algorithm:0,backend:0,cs:0, frontend:0, language:0}, album: {} };
        state.rankInfo = {};
        state.isShowLogin = false;
      })
      .addCase(rankingInfo.fulfilled, (state, { payload }) => {
        // console.log("랭킹정보",payload)
        state.rankInfo = payload;
      })
  },
});

export const { signUpUser } = userSlice.actions;
export const { changeInfo } = userSlice.actions;
export default userSlice.reducer;
