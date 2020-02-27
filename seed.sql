insert into users 
    (email, hash, first_name, last_name)
values 
    ('testuser@test.com', '$2a$10$tLRySDV1AWpj7pF3GbQWZepriH0gsPde/TVLNOaz7DPqn3uOO2X4a', 'John', 'Doe'),
     ('testuser2@test.com', '$2a$10$mTkMY68IQDFCzNfUG7OR/.Ncj6Bzw9ZgPhBRE8UGW6M2TWWmVJ.Si', 'Peter', 'Maffay')
; 

insert into wines
    (wine_name, wine_type, wine_price, wine_store, wine_label, comments, wine_rating, is_favorite, user_id)
values
    ('Josh', 'Cabernet Sauvignon', '$12.99', 'Kroger', 'josh.jpg', 'Delicious red wine', 5, 'f', 1),  
      ('Nobilo', 'Sauvignon Blanc', '$9.99', 'Kroger', 'nobilo.jpg', 'ok when nothing else available', 3, 't', 2) 
;     



