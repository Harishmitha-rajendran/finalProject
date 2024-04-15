{{
    config(
        tags=['main', 'staging']
    )
}}

WITH stg_user AS(
    SELECT
     id AS userId,
     userName,
     email,
     gender,
     createdAt,
     updated AS passwordUpdated,
     skill, 
     experience,
     designation
     FROM {{source('elp', 'userdetails1') }}
)

SELECT * FROM stg_user