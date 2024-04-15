{{
    config(
        tags=['main', 'mart']
    )
}}

WITH
stg_event AS (
    SELECT
        *
    FROM {{ ref('stg_event') }}
),
eventDistribution AS (
    SELECT 
    description as domain,
    COUNT(eventName) AS totalEvents 
    FROM stg_event
    WHERE status<>'Cancelled'
    GROUP BY domain
    ORDER BY totalEvents DESC
)

SELECT * FROM eventDistribution