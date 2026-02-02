package com.mwc.wr.record.infraestruture.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.record.application.dto.RecordDetails;
import com.mwc.wr.record.application.service.ListRecordsService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/records")
public class RecordController {
    private final ListRecordsService listRecordsService;

    public RecordController(ListRecordsService listRecordsService) {
        this.listRecordsService = listRecordsService;
    }

    @GetMapping("/listTopRecordsByCategory")
    public ResponseEntity<List<RecordDetails>> listTopRecordsByCategory(
            @RequestParam Category category) {
        return ResponseEntity.ok(listRecordsService.listTopRecordsByCategory(category));
    }

}
