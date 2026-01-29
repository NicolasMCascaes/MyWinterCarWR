package com.mwc.wr.shared.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private final Environment env;

    public GlobalExceptionHandler(Environment env) {
        this.env = env;
    }

    @ExceptionHandler(Exception.class)
    public ErrorInfo handleAllExceptions(Exception ex) {
        return new ErrorInfo(
                "Internal Server Error",
                500,
                LocalDateTime.now());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ErrorInfo handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ErrorInfo(
                env.getProperty(ex.getMessage()),
                404,
                LocalDateTime.now());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ErrorInfo handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return new ErrorInfo(
                env.getProperty(ex.getMessage()),
                409,
                LocalDateTime.now());
    }

    @ExceptionHandler({ MethodArgumentNotValidException.class, ConstraintViolationException.class })
    public ResponseEntity<ErrorInfo> handleValidationExceptions(Exception e) {
        String errorMsg;
        if (e instanceof MethodArgumentNotValidException manv) {
            errorMsg = manv.getBindingResult().getAllErrors().stream().map(ObjectError::getDefaultMessage)
                    .collect(Collectors.joining(","));
        } else {
            ConstraintViolationException cve = (ConstraintViolationException) e;
            errorMsg = cve.getConstraintViolations().stream().map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(","));
        }
        ErrorInfo error = new ErrorInfo(errorMsg, HttpStatus.BAD_REQUEST.value(), LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
