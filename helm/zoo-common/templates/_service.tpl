{{- define "zoo-common.service" -}}
apiVersion: v1
kind: Service
metadata:
  name: {{ include "zoo-common.fullname" . }}
  labels:
    {{- include "zoo-common.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type | default "ClusterIP" }}
  ports:
    - name: http
      port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.port }}
      protocol: TCP
  selector:
    {{- include "zoo-common.selectorLabels" . | nindent 4 }}
{{- end }}
