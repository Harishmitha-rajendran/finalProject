{{
    config(
        tags=['main', 'mart']
    )
}}

WITH
stg_user AS (
    SELECT
        *
    FROM {{ ref('stg_user') }}
),
passwordUpdate AS (
    SELECT 
    passwordUpdated,
    COUNT(passwordUpdated) AS count
    FROM stg_user
    GROUP BY passwordUpdated
)

SELECT * FROM passwordUpdate