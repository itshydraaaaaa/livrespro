CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`eventType` varchar(64) NOT NULL,
	`path` varchar(500) NOT NULL,
	`referrer` varchar(500),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(80) NOT NULL,
	`eyebrow` varchar(120),
	`title` varchar(240) NOT NULL,
	`body` text,
	`ctaLabel` varchar(80),
	`ctaHref` varchar(500),
	`imageUrl` text,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_sections_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `seo_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`path` varchar(500) NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` varchar(320) NOT NULL,
	`ogTitle` varchar(160),
	`ogDescription` varchar(320),
	`canonicalUrl` varchar(500),
	`robots` enum('index','noindex') NOT NULL DEFAULT 'index',
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seo_pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `seo_pages_path_unique` UNIQUE(`path`)
);
