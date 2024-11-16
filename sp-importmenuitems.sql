CREATE PROCEDURE `ImportMenuItems` ()
BEGIN
DECLARE done INT DEFAULT FALSE;
    DECLARE v_id INT;
    DECLARE v_item_name VARCHAR(255);
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_image_url VARCHAR(255);
    DECLARE v_description TEXT;
    
    -- Declare a cursor to select raw data from the staging table
    DECLARE cur CURSOR FOR 
        SELECT id,
               JSON_UNQUOTE(JSON_EXTRACT(raw_data, '$.woocommerce-loop-product__title')),
               JSON_UNQUOTE(JSON_EXTRACT(raw_data, '$.woocommerce-Price-amount')),
               JSON_UNQUOTE(JSON_EXTRACT(raw_data, '$.woocommerce-placeholder src')),
               JSON_UNQUOTE(JSON_EXTRACT(raw_data, '$.woocommerce-LoopProduct-link href'))
        FROM staging_table;
    
    -- Declare a handler for cursor loop end
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_id, v_item_name, v_price, v_image_url, v_description;
        
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Insert data into menu_items
        INSERT INTO menu_items (item_name, price, image_url, description)
        VALUES (v_item_name, v_price, v_image_url, v_description);
        
        -- Optional: delete the row after processing
DELETE FROM staging_table 
WHERE
    id = v_id;
    END LOOP;
    
    CLOSE cur;
END
