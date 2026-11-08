package com.mwc.wr.shared.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.context.MessageSourceResolvable;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

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

    @ExceptionHandler(InvalidAttemptStatusException.class)
    public ResponseEntity<ErrorInfo> handleInvalidAttemptStatusException(InvalidAttemptStatusException ex) {
        return build(resolveMessage(ex.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidCountryException.class)
    public ResponseEntity<ErrorInfo> handleInvalidCountryException(InvalidCountryException ex) {
        return build(resolveMessage(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidVideoLinkException.class)
    public ResponseEntity<ErrorInfo> handleInvalidVideoLinkException(InvalidVideoLinkException ex) {
        return build(resolveMessage(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorInfo> handleBadCredentialsException(BadCredentialsException ex) {
        return build(resolveMessage(ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorInfo> handleAccessDeniedException(AccessDeniedException ex) {
        return build("Access denied", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErrorInfo> handleHandlerMethodValidation(HandlerMethodValidationException ex) {
        String errorMsg = ex.getAllErrors().stream().map(MessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(","));
        return build(errorMsg, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorInfo> handleNoResourceFound(NoResourceFoundException ex) {
        return build("Resource not found", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorInfo> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return build("HTTP method not supported", HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler({ HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class })
    public ResponseEntity<ErrorInfo> handleMalformedRequest(Exception ex) {
        return build("Malformed request: invalid JSON or parameter value", HttpStatus.BAD_REQUEST);
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

    private ResponseEntity<ErrorInfo> build(String message, HttpStatus status) {
        return new ResponseEntity<>(new ErrorInfo(message, status.value(), LocalDateTime.now()), status);
    }

    private String resolveMessage(String messageKey) {
        String resolved = env.getProperty(messageKey);
        return resolved != null ? resolved : messageKey;
    }
}
