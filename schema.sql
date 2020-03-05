create table users (
    id serial primary key,
    email text,
    hash text,
    first_name text,
    last_name text
);

create table wines (
    id serial primary key,
    wine_name text,
    wine_type text,
    wine_price money,
    wine_store text,
    wine_label text,
    comments text,
    wine_rating integer,
    is_favorite boolean, 
    user_id integer references users (id) on delete cascade
);

create table favorite_wines (
    id serial primary key,
    user_id integer references users (id) on delete cascade,
    wine_id integer references wines (id) on delete cascade
  
);