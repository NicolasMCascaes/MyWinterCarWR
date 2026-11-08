package com.mwc.wr.attempt.domain.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;
import java.util.Set;

public final class VideoLinkPolicy {
    private static final Set<String> ALLOWED_SCHEMES = Set.of("http", "https");
    private static final Set<String> ALLOWED_HOSTS = Set.of(
            "youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be",
            "twitch.tv", "www.twitch.tv", "m.twitch.tv", "clips.twitch.tv");

    private VideoLinkPolicy() {
    }

    public static boolean isAllowed(String videoLink) {
        if (videoLink == null || videoLink.isBlank()) {
            return false;
        }
        try {
            URI uri = new URI(videoLink.trim());
            String scheme = uri.getScheme();
            String host = uri.getHost();
            return scheme != null && host != null
                    && ALLOWED_SCHEMES.contains(scheme.toLowerCase(Locale.ROOT))
                    && ALLOWED_HOSTS.contains(host.toLowerCase(Locale.ROOT));
        } catch (URISyntaxException e) {
            return false;
        }
    }
}
