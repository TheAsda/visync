CREATE TABLE `client` (
	`clientId` text PRIMARY KEY NOT NULL,
	`roomId` text
);
--> statement-breakpoint
CREATE TABLE `room` (
	`roomId` text PRIMARY KEY NOT NULL,
	`link` text
);
