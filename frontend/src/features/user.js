import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = JSON.parse(localStorage.getItem('user')) || {
    _id: "",
    name:"",
    email:"",
    avatar:"",
    token:""
}

export const loginUser = createAsyncThunk("user/login",async({email,password},thunkAPI)=>{
    try{
        const res = await axios.post("http://localhost:5000/user/login",{
            email,
            password
        });
        return res.data;
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:5000/user/register", {
        name,
        email,
        password,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        reset(state){
            state._id = ""
            state.name = ""
            state.email = ""
            state.avatar=  ""
            state.token = ""
            localStorage.removeItem("user");
        },
        extraReducers(builder){
            builder
                .addCase(loginUser.fulfilled,(state,action)=>{
                    const {_id,name,email,avatar,token} = action.payload;
                    state._id = _id;
                    state.name = name;
                    state.email = email;
                    state.avatar = avatar;
                    state.token = token;
                    localStorage.setItem("user",
                    JSON.stringify({
                        _id,
                        name,
                        email,
                        avatar,
                        token
                    })
                    )
                })
                .addCase(loginUser.rejected,(_,action)=>{
                    alert(action.payload)
                })
                .addCase(registerUser.fulfilled, (state,action)=>{
                    const { _id, name, email, avatar,token } = action.payload;
                    state._id = _id;
                    state.name = name;
                    state.email = email;
                    state.avatar = avatar;
                    state.token = token;
                    localStorage.setItem(
                      "user",
                      JSON.stringify({
                        _id,
                        name,
                        email,
                        avatar,
                        token
                      })
                    );
                })
                .addCase(registerUser.rejected,(_,action)=>{
                    alert(action.payload)
                })
        }
    }
})

export const selectUser = (state) => state.user;

export const { setUser, reset } = userSlice.actions;

export default userSlice.reducer;
