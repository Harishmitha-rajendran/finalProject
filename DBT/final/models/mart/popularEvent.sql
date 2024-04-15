{{
    config(
        tags=['main', 'mart']
    )
}}

WITH
stg_interest AS (
    SELECT
        *
    FROM {{ ref('stg_interest') }}
),

stg_event AS (
    SELECT
        *
    FROM {{ ref('stg_event') }}
),

popularEvent AS (
    SELECT 
      e.eventName,
      COUNT(*) AS interestCount
    FROM 
      stg_interest i 
    JOIN 
      stg_event e
    ON
      i.eventId=e.eventId
    GROUP BY 
      e.eventName
    ORDER BY 
      interestCount DESC
)

SELECT * FROM popularEvent
