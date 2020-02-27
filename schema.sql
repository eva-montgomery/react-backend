create table users (
    id serial primary key,
    email text,
    password text,
    first_name text,
    last_name text
);

create table wines (
    id serial primary key,
    wine_name text,
    wine_type text,
    wine_price varchar(5),
    wine_store text,
    wine_label text,
    comments text,
    wine_rating varchar(5),
    user_id integer references users (id)
);
