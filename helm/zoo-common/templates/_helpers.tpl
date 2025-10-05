{{- define "zoo-common.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{- define "zoo-common.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "zoo-common.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{- define "zoo-common.chart" -}}
{{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}

{{- define "zoo-common.serviceAccountName" -}}
{{- default "default" .Values.serviceAccount.name -}}
{{- end -}}
