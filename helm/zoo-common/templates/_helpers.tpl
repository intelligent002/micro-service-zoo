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

{{- define "zoo-common.zoo-db-SecretName-static" -}}
{{- "stage-zoo-db-secret" -}}
{{- end -}}

{{- define "zoo-common.zoo-db-SecretName" -}}
{{- printf "%s-zoo-db-secret" .Release.Name -}}
{{- end -}}

{{- define "zoo-common.ingressHostBase" -}}
{{- default "zoo.local" .Values.global.ingress.hostBase -}}
{{- end -}}

{{/*
Return the full ingress hostname for self chart
Usage: include "zoo-common.ingress-host-self" .
*/}}
{{- define "zoo-common.ingress-host-self" -}}
{{- $hostBase := include "zoo-common.ingressHostBase" $ -}}
{{- printf "%s-%s.%s" .Release.Name .Chart.Name $hostBase -}}
{{- end -}}

{{/*
Return the full ingress hostname for a given subchart service.
Usage:
  {{ include "zoo-common.ingress-host-for" (dict "root" $ "name" "zoo-python-flask") }}
*/}}
{{- define "zoo-common.ingress-host-for" -}}
{{- $root := .root -}}
{{- $name := .name -}}
{{- $base := include "zoo-common.ingressHostBase" $root -}}
{{- printf "%s-%s.%s" $root.Release.Name $name $base -}}
{{- end -}}


{{/*
Return the full in-cluster DNS hostname for a given subchart service.
Usage: include "zoo-common.service-host" (dict "root" $ "name" "zoo-python-flask")
*/}}
{{- define "zoo-common.service-host-for" -}}
{{- $root := .root -}}
{{- $name := .name -}}
{{- printf "%s-%s.%s.svc.cluster.local" $root.Release.Name $name $root.Release.Namespace -}}
{{- end -}}