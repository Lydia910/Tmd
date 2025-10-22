CREATE TABLE `glpi_dev`.`plugin_customer` ( 
  `cust_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, 
  `username` VARCHAR(50) NOT NULL, 
  `first_name` VARCHAR(50) NOT NULL, 
  `last_name` VARCHAR(50) NOT NULL, 
  `email` VARCHAR(100) NOT NULL, 
  `password` VARCHAR(255) NOT NULL, 
  PRIMARY KEY (`cust_id`), 
  UNIQUE (`username`)
) ENGINE=InnoDB;


CREATE TABLE `glpi_dev`.`plugin_tickets` (
  `ticket_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, 
  `cust_id` INT(10) UNSIGNED NOT NULL, 
  `user_id` INT(10) UNSIGNED NOT NULL, 
  `title` VARCHAR(255) NULL DEFAULT NULL, 
  `status` ENUM('Opened','Waiting for review','Closed') NOT NULL DEFAULT 'Opened', 
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (`ticket_id`),
  CONSTRAINT `fk_tickets_user` FOREIGN KEY (`user_id`) REFERENCES `glpi_users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_tickets_customer` FOREIGN KEY (`cust_id`) REFERENCES `plugin_customer`(`cust_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE `glpi_dev`.`plugin_message` (
  `message_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` INT(10) UNSIGNED NOT NULL, 
  `sender` ENUM('user','bot') NOT NULL, 
  `message` TEXT NULL DEFAULT NULL, 
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (`message_id`, `ticket_id`),
  CONSTRAINT `fk_message_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `plugin_tickets`(`ticket_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE `glpi_dev`.`plugin_ticket_log` (
  `ticket_id` INT(10) UNSIGNED NOT NULL, 
  `user_id` INT(10) UNSIGNED NOT NULL, 
  `action` VARCHAR(100) NOT NULL, 
  `details` TEXT NOT NULL, 
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`ticket_id`, `user_id`, `timestamp`),
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `glpi_users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_log_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `plugin_tickets`(`ticket_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE `glpi_dev`.`plugin_customer_log` (
	`cust_id` INT(10) UNSIGNED NOT NULL , 
	`user_id` INT(10) UNSIGNED NOT NULL , 
	`action` VARCHAR(100) NOT NULL , 
	`details` TEXT NOT NULL , 
	`timestamp` TIMESTAMP NOT NULL,
	PRIMARY KEY (`cust_id`, `user_id`, `timestamp`),
	CONSTRAINT `fk_cuslog_user` FOREIGN KEY (`user_id`) REFERENCES `glpi_users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  	CONSTRAINT `fk_cuslog_ticket` FOREIGN KEY (`cust_id`) REFERENCES `plugin_customer`(`cust_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB;



