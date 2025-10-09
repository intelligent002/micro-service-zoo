{{- define "extra-env" -}}
- name: BACKEND_HOSTNAME
  value: {{ printf "http://%s/graphql" (include "zoo-common.ingress-host-for" (dict "root" $ "name" "zoo-python-flask")) | quote }}
{{- end -}}