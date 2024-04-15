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

event_durations AS (
    SELECT
        trainer,
        DATEDIFF('minute', startDate, endDate) / 60.0 AS duration_hours
    FROM
        stg_event
),

trainerUtilization AS  (
    SELECT
        trainer,
        SUM(duration_hours) AS total_training_time_hours
    FROM
        event_durations
    GROUP BY
        trainer
    ORDER BY total_training_time_hours DESC
)

SELECT * FROM trainerUtilization 

