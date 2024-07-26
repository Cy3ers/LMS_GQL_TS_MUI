import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Avatar, Button, CssBaseline } from "@mui/material";

const defaultTheme = createTheme();

interface LoginFormInputs {
  username: string;
  password: string;
}

interface LoginProps {
  handleSubmit: SubmitHandler<LoginFormInputs>;
  invalidError?: string | null;
}

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required")
});

const Login: React.FC<LoginProps> = ({ handleSubmit, invalidError }) => {
  const { control, handleSubmit: formSubmit } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component='main'
        maxWidth='xs'
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component='h1'
            variant='h5'
          >
            Login
          </Typography>
          <Box
            component='form'
            onSubmit={formSubmit(handleSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Controller
              name='username'
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='username'
                  label='Username'
                  name='username'
                  autoComplete='username'
                  autoFocus
                  onChange={onChange}
                  value={value}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='password'
                  label='Password'
                  name='password'
                  autoComplete='password'
                  onChange={onChange}
                  value={value}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            {invalidError && <div className='error-msg'>{invalidError}</div>}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
