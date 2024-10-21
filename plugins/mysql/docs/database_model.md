# Database model

The

```mermaid
erDiagram
   device {
    VARCHAR_24 id
    VARCHAR_100 name
    BOOLEAN active
    JSON tags
    TEXT encoder_stack
    VARCHAR_20 type
    VARCHAR_30 data_retention
    TEXT payload_parser
    TIMESTAMP last_input
    TIMESTAMP last_output
    TIMESTAMP created_at
    TIMESTAMP updated_at
    TIMESTAMP inspected_at
  }

  analysis {
    VARCHAR_24 id
    VARCHAR_100 name
    BOOLEAN active
    JSON tags
    text binary_path
    text file_path
    JSON options
    JSON variables
    TIMESTAMP last_run
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  analysis_log }o--|| analysis: analysis_id
  analysis_log {
    TIMESTAMP timestamp
    VARCHAR_24 analysis_id
    TEXT message
    BOOLEAN error
  }

  action {
    VARCHAR_24 id
    VARCHAR_100 name
    BOOLEAN active
    JSON tags
    JSON action
    JSON device_info
    JSON trigger
    TIMESTAMP last_triggered
    TIMESTAMP created_at
    TIMESTAMP updated_at
    TEXT type
  }

  device_token }o--|| device: device_id
  device_token {
    VARCHAR_40 token
    VARCHAR_100 name
    VARCHAR_10 permission
    VARCHAR_100 expire_time
    VARCHAR_24 device_id
    TEXT serie_number
    TEXT last_authorization
    TIMESTAMP created_at
  }

  device_params }o--|| device: device_id
  device_params {
    VARCHAR_24 id
    TEXT key
    TEXT value
    BOOLEAN sent
    VARCHAR_24 device_id
  }

  statistics {
    TIMESTAMP time
    INTEGER input
    INTEGER output
  }


```

### device database

```mermaid
erDiagram
   data {
    VARCHAR_24 id
    VARCHAR_100 variable
    VARCHAR_15 typ`
    TEXT value
    VARCHAR_100 unit
    VARCHAR_24 group
    JSON location
    JSON metadata
    TIMESTAMP time
    TIMESTAMP created_at
  }

```
