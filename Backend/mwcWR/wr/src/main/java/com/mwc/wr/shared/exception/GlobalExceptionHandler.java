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
    public ResponseEntity<ErrorInfo> handleAllExceptions(Exception ex) {
        ErrorInfo error = new ErrorInfo(
                "Internal Server Error",
                500,
                LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorInfo> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorInfo error = new ErrorInfo(
                resolveMessage(ex.getMessage()),
                404,
                LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorInfo> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        ErrorInfo error = new ErrorInfo(
                resolveMessage(ex.getMessage()),
                409,
                LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AttemptAlreadyPendingException.class)
    public ResponseEntity<ErrorInfo> handleAttemptAlreadyPendingException(AttemptAlreadyPendingException ex) {
        ErrorInfo error = new ErrorInfo(
                resolveMessage(ex.getMessage()),
                409,
                LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
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

    private String resolveMessage(String messageKey) {
        String resolved = env.getProperty(messageKey);
        return resolved != null ? resolved : messageKey;
    }
}
