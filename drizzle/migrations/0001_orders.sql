CREATE TABLE `orders` (
 `id` int AUTO_INCREMENT NOT NULL,
 `firstName` varchar(120) NOT NULL,
 `lastName` varchar(120) NOT NULL,
 `email` varchar(320) NOT NULL,
 `phone` varchar(80) NOT NULL,
 `deliveryAddress` text NOT NULL,
 `quantity` int NOT NULL DEFAULT 1,
 `educator` int NOT NULL DEFAULT 0,
 `productHandle` varchar(180) NOT NULL,
 `productTitle` varchar(300) NOT NULL,
 `paymentMethod` varchar(80) NOT NULL DEFAULT 'cash_on_delivery',
 `status` enum('new','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'new',
 `createdAt` timestamp NOT NULL DEFAULT (now()),
 `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
