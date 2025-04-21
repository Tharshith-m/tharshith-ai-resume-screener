from opensearchpy import OpenSearch

# OpenSearch connection
opensearch_client = OpenSearch(
    hosts=[{"host": "opensearch", "port": 9200}],
    http_auth=("admin", "admin"),
    use_ssl=False,
    verify_certs=False
)
