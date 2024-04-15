{{
    config(
        tags=['main', 'staging']
    )
}}

WITH stg_interest AS(
    SELECT
     id AS interestId,
     event_id AS eventId,
     user_id AS userId
     FROM {{source('elp', 'interestdetails1') }}
)

SELECT * FROM stg_interest