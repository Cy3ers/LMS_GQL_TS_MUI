import React from "react";
import { useToast } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { ALL_TASKS } from "../GQL/queries";
import { CREATE_TASK } from "../GQL/mutations";
import { useGqlQuery } from "../hooks/useGraphQL";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AppBar, Toolbar, Container, Typography, TextField, Button, CircularProgress, Box } from "@mui/material";

interface TaskFormInputs {
  title: string;
  description: string;
  status: string;
  priority: string;
}

const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
  priority: Yup.string().required("Priority is required")
});

const AddTask: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields }
  } = useForm<TaskFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });
  const { save: addTask, loading: addTaskLoading } = useGqlQuery({ query: ALL_TASKS, mutation: CREATE_TASK });

  const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    try {
      await addTask(data);
      showToast("Task added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography
            variant='h6'
            style={{ flexGrow: 1 }}
          >
            Add Task
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label='Title'
            margin='normal'
            {...register("title")}
            error={!!errors.title}
            helperText={touchedFields.title && errors.title?.message}
          />
          <TextField
            fullWidth
            label='Description'
            margin='normal'
            {...register("description")}
            error={!!errors.description}
            helperText={touchedFields.description && errors.description?.message}
          />
          <TextField
            fullWidth
            label='Status'
            margin='normal'
            {...register("status")}
            error={!!errors.status}
            helperText={touchedFields.status && errors.status?.message}
          />
          <TextField
            fullWidth
            label='Priority'
            margin='normal'
            {...register("priority")}
            error={!!errors.priority}
            helperText={touchedFields.priority && errors.priority?.message}
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
              disabled={!isValid || addTaskLoading}
            >
              {addTaskLoading ? <CircularProgress size={24} /> : "Add Task"}
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default AddTask;
