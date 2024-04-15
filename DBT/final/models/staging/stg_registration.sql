{{
    config(
        tags=['main', 'staging']
    )
}}

WITH stg_registration AS(
    SELECT
     id AS registrationId,
     event_id AS eventId,
     user_id AS userId,
     registeredat as registeredAt
     FROM {{source('elp', 'registrationdetails1') }}
)

SELECT * FROM stg_registration