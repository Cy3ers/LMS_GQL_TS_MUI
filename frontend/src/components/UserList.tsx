import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { User, UserListProps } from "../types";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

interface UserFormInputs {
  username: string;
  password: string;
  search?: string;
}

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  search: Yup.string()
});

const UserList: React.FC<UserListProps> = ({ users, addUser, removeUser }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
    reset
  } = useForm<UserFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<UserFormInputs> = (data) => {
    addUser({ username: data.username, password: data.password });
    reset({ username: "", password: "", search: data.search });
  };

  const searchQuery = watch("search", "");

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery ? searchQuery.toLowerCase() : "")
  );

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography
            variant='h6'
            style={{ flexGrow: 1 }}
          >
            User Management
          </Typography>
          <Button
            color='inherit'
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth='sm'>
        <Box mt={2}>
          <Typography
            variant='h5'
            gutterBottom
          >
            Add Users
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label='Username'
              margin='normal'
              {...register("username")}
              error={!!errors.username}
              helperText={touchedFields.username && errors.username?.message}
            />
            <TextField
              fullWidth
              label='Password'
              type='password'
              margin='normal'
              {...register("password")}
              error={!!errors.password}
              helperText={touchedFields.password && errors.password?.message}
            />
            <Box
              mt={2}
              display='flex'
              justifyContent='center'
            >
              <Button
                variant='contained'
                color='primary'
                type='submit'
                disabled={!isValid}
              >
                Add User
              </Button>
            </Box>
          </form>
        </Box>
        <Box mt={4}>
          <Typography
            variant='h5'
            gutterBottom
          >
            Search Users
          </Typography>
          <TextField
            fullWidth
            label='Search by username'
            margin='normal'
            {...register("search")}
          />
        </Box>
        <Box mt={4}>
          <Typography
            variant='h5'
            gutterBottom
          >
            Users
          </Typography>
          <List>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: User) => (
                <ListItem
                  key={user.username}
                  divider
                >
                  <ListItemText primary={user.username} />
                  <IconButton
                    edge='end'
                    aria-label='delete'
                    onClick={() => user.id && removeUser(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary='No users found' />
              </ListItem>
            )}
          </List>
        </Box>
      </Container>
    </>
  );
};

export default UserList;
