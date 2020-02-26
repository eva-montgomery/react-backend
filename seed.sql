insert into users 
    (email, password, first_name, last_name)
values 
    ('testuser@test.com', '1234', 'John', 'Doe'),
     ('testuser2@test.com', '4321', 'Peter', 'Maffay')
; 

insert into wine
    (wine_name, wine_type, wine_price, wine_store, wine_label, comments, wine_rating)
values
    ('Josh', 'Cabernet Sauvignon', '12.99', 'Kroger', 'josh.jpg', 'Delicious red wine', '5'),  
      ('Nobilo', 'Sauvignon Blanc', '9.99', 'Kroger', 'nobilo.jpg', 'ok when nothing else available', '3') 
;     